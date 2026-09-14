export function medleyClassName(className,playing) {
  const classes=new Set(className.split(/\s+/).filter(Boolean));
  // Playback updates must not undo the visibility class added by scroll reveal.
  if(classes.has('reveal'))classes.add('is-visible');
  if(playing)classes.add('is-playing');else classes.delete('is-playing');
  return [...classes].join(' ');
}
