from flask_cors import CORS
from flask import Flask, request, jsonify
import cv2
import numpy as np
import mediapipe as mp

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose

def cm_to_inch(cm):
    """Converts centimeters to inches, rounded to two decimal places."""
    return round(cm / 2.54, 2)

@app.route('/api/image-measurement', methods=['POST'])
def measure_from_image():
    """
    Receives an image and real height, processes it using MediaPipe Pose,
    and returns estimated body measurements (chest, waist, height).
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        real_height_cm = float(request.form.get("real_height", 0))
        if real_height_cm <= 0:
            return jsonify({"error": "Invalid real height. Please provide a positive number."}), 400
    except ValueError:
        return jsonify({"error": "Height must be a number."}), 400

    file = request.files['image']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    if image is None:
        return jsonify({"error": "Could not decode image. Please ensure it's a valid image file."}), 400

    # Get actual image dimensions for scaling
    image_h, image_w, _ = image.shape

    # Process the image with MediaPipe Pose
    # Added model_complexity=1 for potentially better landmark detection on static images
    with mp_pose.Pose(static_image_mode=True, model_complexity=1) as pose:
        results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        
        if not results.pose_landmarks:
            return jsonify({"error": "Could not detect body landmarks. Please ensure the person is fully visible, well-lit, and in a clear pose."}), 400

        landmarks = results.pose_landmarks.landmark

        # --- Helper functions to convert normalized landmarks to pixel coordinates and calculate pixel distances ---

        def get_pixel_coords(landmark_index):
            """Converts normalized landmark coordinates to pixel coordinates."""
            lm = landmarks[landmark_index]
            # Ensure coordinates are within [0, 1] before scaling
            x_pixel = max(0, min(1, lm.x)) * image_w
            y_pixel = max(0, min(1, lm.y)) * image_h
            return np.array([x_pixel, y_pixel])

        def get_pixel_dist(p1_index, p2_index):
            """Calculates the Euclidean distance in pixels between two landmarks."""
            coords1 = get_pixel_coords(p1_index)
            coords2 = get_pixel_coords(p2_index)
            return np.linalg.norm(coords1 - coords2)

        # --- Calculate Pixel Height and Scale Factor ---
        # Get approximate top of the head's y-coordinate
        top_y_pixel = min(get_pixel_coords(mp_pose.PoseLandmark.NOSE)[1],
                          get_pixel_coords(mp_pose.PoseLandmark.LEFT_EYE)[1],
                          get_pixel_coords(mp_pose.PoseLandmark.RIGHT_EYE)[1])

        # Get approximate bottom of the feet's y-coordinate
        bottom_y_pixel = max(get_pixel_coords(mp_pose.PoseLandmark.LEFT_ANKLE)[1],
                             get_pixel_coords(mp_pose.PoseLandmark.RIGHT_ANKLE)[1],
                             get_pixel_coords(mp_pose.PoseLandmark.LEFT_HEEL)[1],
                             get_pixel_coords(mp_pose.PoseLandmark.RIGHT_HEEL)[1])
        
        person_pixel_height = bottom_y_pixel - top_y_pixel

        if person_pixel_height <= 0:
            return jsonify({"error": "Could not accurately determine person's pixel height. Ensure the full body is visible and standing upright."}), 400

        # Calculate the scale factor: how many real-world centimeters correspond to one pixel.
        scale_cm_per_pixel = real_height_cm / person_pixel_height

        # --- Calculate Body Measurements in CM ---

        # Shoulder width in pixels
        shoulder_width_pixels = get_pixel_dist(mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.RIGHT_SHOULDER)
        # Hip width in pixels
        hip_width_pixels = get_pixel_dist(mp_pose.PoseLandmark.LEFT_HIP, mp_pose.PoseLandmark.RIGHT_HIP)

        # Convert pixel widths to centimeters using the calculated scale factor
        shoulder_width_cm = shoulder_width_pixels * scale_cm_per_pixel
        hip_width_cm = hip_width_pixels * scale_cm_per_pixel

        # --- Estimate Circumferences from Widths ---
        chest_circumference_cm = shoulder_width_cm * 2.1 
        waist_circumference_cm = hip_width_cm * 1.8     

        # Prepare the response data
        measurements = {
            "chest_cm": round(chest_circumference_cm, 2),
            "chest_in": cm_to_inch(chest_circumference_cm),
            "waist_cm": round(waist_circumference_cm, 2),
            "waist_in": cm_to_inch(waist_circumference_cm),
            # The height returned here is the real height provided by the user, not a derived one.
            "height_cm": round(real_height_cm, 2), 
            "height_in": cm_to_inch(real_height_cm)
        }

        return jsonify(measurements)

if __name__ == '__main__':
    # Running in debug mode for easier development and error tracing
    app.run(port=8000, debug=True)