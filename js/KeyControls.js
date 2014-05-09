/**
 * KeyControls.js
 *
 * @overview Extends ThreeJS to include some simple keyboard controls for
 *     navigating a virtual environment with a first-person camera
 *     perspective.
 * @author Nate Beatty | {@link http://natebeatty.com|tnbeatty}
 * @copyright {@link http://irisvr.com|IrisVR} 2014
 *
 */

/**
 * The KeyControls class for first-person perspective camera movement.
 *
 * @public
 * @class
 *
 * @param {THREE.PerspectiveCamera} camera The camera that will be controlled
 *     by keyboard input.
 *
 * @param {element} [element=document] domElement The DOM element in which the
 *     scene is rendered.
 */
THREE.KeyControls = function(object, domElement) {
  this.object = object;
  this.target = new THREE.Vector3(0, 0, 0);

  this.domElement = (domElement !== undefined) ? domElement : document;

  /**
   * The speed at which the player should perform translation movement.
   * @const {number}
   */
  this.movementSpeed = 1.0;
  /**
   * The speed at which the player should rotate (pitch, yaw, roll).
   * @const {number}
   */
  this.lookSpeed = 0.01;

  /**
   * Allow the user to look up and down (pitch).
   * @const {boolean}
   */
  this.lookVertical = true;

  /**
   * Invert pitch controls
   * @const {boolean}
   */
  this.invertVertical = false;

  /**
   * Constrain minimum pitch angle [0..pi]
   * @const {number}
   */
  this.verticalMin = 0;

  /**
   * Constrain maximum pitch angle [0..pi]
   * @const {number}
   */
  this.verticalMax = Math.PI;

  this.lat = 0;
  this.lon = 0;
  this.phi = 0; // vertical angle
  this.theta = 0; // rotational (around y) angle

  this.translateForward = false;
  this.translateBackward = false;
  this.translateLeft = false;
  this.translateRight = false;
  this.yawRight = false;
  this.yawLeft = false;
  this.pitchUp = false;
  this.pitchDown = false;

  // prevent document from being selected with tab
  if (this.domElement !== document) this.domElement.setAttribute('tabindex', -1);

  /**
   * @private
   * @function onKeyDown
   */
  this.onKeyDown = function(event) {
    switch (event.keyCode) {

      case 87:
        /*W*/
        this.translateForward = true;
        break;
      case 65:
        /*A*/
        this.translateLeft = true;
        break;
      case 83:
        /*S*/
        this.translateBackward = true;
        break;
      case 68:
        /*D*/
        this.translateRight = true;
        break;

      case 38:
        /*up*/
        this.pitchUp = true;
        break;
      case 40:
        /*down*/
        this.pitchDown = true;
        break;

      case 37:
        /*left*/
        this.yawLeft = true;
        break;
      case 81:
        /*Q*/
        this.panLeft = true;
        break;
      case 39:
        /*right*/
        this.yawRight = true;
        break;
      case 69:
        /*E*/
        this.panRight = true;
        break;

      case 27:
        /*esc*/
        this.freeze = !this.freeze;
        break; // GTFO
    }
  };

  /**
   * @private
   * @function onKeyUp
   */
  this.onKeyUp = function(event) {
    switch (event.keyCode) {

      case 87:
        /*W*/
        this.translateForward = false;
        break;
      case 65:
        /*A*/
        this.translateLeft = false;
        break;
      case 83:
        /*S*/
        this.translateBackward = false;
        break;
      case 68:
        /*D*/
        this.translateRight = false;
        break;

      case 38:
        /*up*/
        this.pitchUp = false;
        break;
      case 40:
        /*down*/
        this.pitchDown = false;
        break;

      case 37:
        /*left*/
        this.yawLeft = false;
        break;
      case 81:
        /*Q*/
        this.panLeft = false;
        break;
      case 39:
        /*right*/
        this.yawRight = false;
        break;
      case 69:
        /*E*/
        this.panRight = false;
        break;

      case 27:
        /*esc*/
        this.freeze = !this.freeze;
        break; // GTFO

    }
  };

  /**
   * @private
   * @function update
   * @param timeDelta {number} The time elapsed since the last time the
   *     screen was rendered. This time difference is used to calculate the
   *     camera position change from frame to frame.
   *
   */
  this.update = function(timeDelta) {
    var translationSpeed = timeDelta * this.movementSpeed;

    // ** translation movement **
    // --------------------------

    // z-axis movement (forward / backward)
    if (this.translateForward) this.object.translateZ(-translationSpeed);
    if (this.translateBackward) this.object.translateZ(translationSpeed);

    // x-axis movement (horizontal)
    if (this.translateLeft) this.object.translateX(-translationSpeed);
    if (this.translateRight) this.object.translateX(translationSpeed);

    // y-axis movement (vertical)

    // ** rotational movement (camera target) **
    // -----------------------------------------

    var actualLookSpeed = this.lookSpeed; // temporary hack

    // execute simple stepwise rotation
    if (this.yawLeft) this.theta -= actualLookSpeed;
    if (this.yawRight) this.theta += actualLookSpeed;

    // vertical rotation (pitch)
    if (this.lookVertical) {
      var invertfactor = (this.invertVertical) ? 1 : -1;
      if (this.pitchUp) this.lat += (invertfactor * 0.5);
      if (this.pitchDown) this.lat -= (invertfactor * 0.5);
    }
    this.lat = Math.max(-89, Math.min(89, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);

    // complete all rotation by pointing the camera
    var targetPosition = this.target,
      position = this.object.position;

    var distanceAhead = 100;
    targetPosition.x = position.x + distanceAhead * Math.sin(this.phi) * Math.cos(
      this.theta);
    targetPosition.y = position.y + distanceAhead * Math.cos(this.phi);
    targetPosition.z = position.z + distanceAhead * Math.sin(this.phi) * Math.sin(
      this.theta);

    this.object.lookAt(targetPosition);
  };

  window.addEventListener('keydown', bind(this, this.onKeyDown), false);
  window.addEventListener('keyup', bind(this, this.onKeyUp), false);

  function bind(scope, fn) {
    return function() {
      fn.apply(scope, arguments);
    };
  };

};
