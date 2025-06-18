const video = document.getElementById("video");

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => { video.srcObject = stream; })
      .catch((err) => {
        alert("Camera access denied!");
        console.error(err);
      });

    function changeShirt(src) {
      document.getElementById("shirt").src = src;
    }

    function animateExit(event) {
      event.preventDefault();
      document.body.classList.remove("zoom-in");
      document.body.classList.add("zoom-out");
      setTimeout(() => {
        window.location.href = event.target.closest('a').href;
      }, 300);
    }
    interact('.draggable')
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let x = parseFloat(target.getAttribute('data-x')) || 0;
            let y = parseFloat(target.getAttribute('data-y')) || 0;

            Object.assign(target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`
            });

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      });