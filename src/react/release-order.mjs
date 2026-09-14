// Years match the existing HISTORY/PRESS archive; never invent a release day.
const archiveYears={'nocturne':'2023','eclipse':'2024','no-signal':'2024','new-moon':'2024','lucid':'2025'};
export function releaseOrder(id,label){
  const year=label.match(/^20\d{2}/)?.[0]??archiveYears[id];
  if(!year)throw new Error('Unrecognized release year: '+id);
  const phase=label.includes('EARLY')?'10':label.includes('MID')?'50':label.includes('LATE')?'90':'80';
  return {year,key:/^20\d{2}\.\d{2}\.\d{2}/.test(label)?label.slice(0,10):year+'.'+phase};
}
