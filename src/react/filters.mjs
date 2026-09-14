export function matchesContents(record,category) {return category === 'all' || record.category === category;}
export function matchesNotice(record,category,year) {return (category === 'all' || record.category === category) && (year === 'all' || record.year === year);}
