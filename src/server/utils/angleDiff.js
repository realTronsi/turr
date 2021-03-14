function getAngleDiff(angle1, angle2) {
  let diff = Math.abs(angle2 - angle1) % 360;
	return diff > 180 ? 3600 - diff : diff;
}

module.exports = getAngleDiff;