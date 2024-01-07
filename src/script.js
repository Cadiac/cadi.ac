(async function run() {
  let canvas, program, gl, width, height;

  const res = await fetch("fragment.glsl");
  const fragmentShader = await res.text();
  const epoch = performance.now();

  function render() {
    const now = performance.now() - epoch;

    if (width != window.innerWidth || height != window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      (width = window.innerWidth), (height = window.innerHeight);
    }

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, "iTime"), now / 5000);
    gl.uniform2f(gl.getUniformLocation(program, "iResolution"), width, height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimationFrame(render);
  }

  (function setup() {
    // Setup a canvas for the background animation
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.zIndex = 0;

    gl = canvas.getContext("webgl");
    program = gl.createProgram();

    const vertexShader = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    gl.attachShader(program, vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    const vertices = [1, 1, 1, -1, -1, 1, -1, -1];

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    window.requestAnimationFrame(render);
  })();
})();
