export function matchesContents(record,category) {return category === 'all' || record.category === category;}
export function matchesNotice(record,category,year) {return (category === 'all' || record.category === category) && (year === 'all' || record.year === year);}
export function matchesPhoto(categories,filter) {return filter==='all' || categories.split(/\s+/).includes(filter);}
export function nextPhotoIndex(index,step,length) {return length ? (index+step+length)%length : -1;}
