function preventScroll(event) {
  // We don't want to scroll below zero or above the width and height
  const maxX = this.scrollWidth - this.offsetWidth;
  const maxY = this.scrollHeight - this.offsetHeight;

  // If this event looks like it will scroll beyond the bounds of the element, prevent it and set the scroll to the boundary manually
  if (
    this.scrollLeft + event.deltaX < 0 ||
    this.scrollLeft + event.deltaX > maxX ||
    this.scrollTop + event.deltaY < 0 ||
    this.scrollTop + event.deltaY > maxY
  ) {
    event.preventDefault();

    // Manually set the scroll to the boundary
    this.scrollLeft = Math.max(
      0,
      Math.min(maxX, this.scrollLeft + event.deltaX)
    );
    this.scrollTop = Math.max(0, Math.min(maxY, this.scrollTop + event.deltaY));
  }
}

export function removeListener(element) {
  element.removeEventListener('mousewheel', preventScroll);
}

export default function(element) {
  // Add the event listener which gets triggered when using the trackpad
  element.addEventListener('mousewheel', preventScroll, false);
}
