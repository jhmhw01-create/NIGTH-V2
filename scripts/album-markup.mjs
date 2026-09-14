// Some original album pages put their image dialog after the footer.
// Bring only that authored markup into React, never the legacy event scripts.
import {archiveMarkup} from './archive-markup.mjs';
export function albumMarkup(page) {return archiveMarkup(page,'album');}
