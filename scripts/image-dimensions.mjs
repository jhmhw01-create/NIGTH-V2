import {open,readdir} from 'node:fs/promises';
import {extname,join,relative,sep} from 'node:path';

const supported=new Set(['.gif','.jpeg','.jpg','.png','.webp']);
const sofMarkers=new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);

function pngSize(buffer){
  if(buffer.length<24||buffer.toString('hex',0,8)!=='89504e470d0a1a0a')return null;
  return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
}
function gifSize(buffer){
  if(buffer.length<10||!['GIF87a','GIF89a'].includes(buffer.toString('ascii',0,6)))return null;
  return {width:buffer.readUInt16LE(6),height:buffer.readUInt16LE(8)};
}
function jpegSize(buffer){
  if(buffer.length<4||buffer[0]!==0xff||buffer[1]!==0xd8)return null;
  let offset=2;
  while(offset+9<buffer.length){
    if(buffer[offset]!==0xff){offset+=1;continue;}
    const marker=buffer[offset+1];
    offset+=2;
    if(marker===0xd8||marker===0x01)continue;
    if(marker===0xd9||marker===0xda)break;
    if(offset+2>buffer.length)break;
    const length=buffer.readUInt16BE(offset);
    if(length<2||offset+length>buffer.length)break;
    if(sofMarkers.has(marker))return {height:buffer.readUInt16BE(offset+3),width:buffer.readUInt16BE(offset+5)};
    offset+=length;
  }
  return null;
}
function webpSize(buffer){
  if(buffer.length<30||buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')return null;
  const chunk=buffer.toString('ascii',12,16);
  if(chunk==='VP8X')return {
    width:1+buffer[24]+(buffer[25]<<8)+(buffer[26]<<16),
    height:1+buffer[27]+(buffer[28]<<8)+(buffer[29]<<16)
  };
  if(chunk==='VP8L'&&buffer[20]===0x2f)return {
    width:1+buffer[21]+((buffer[22]&0x3f)<<8),
    height:1+((buffer[22]&0xc0)>>6)+(buffer[23]<<2)+((buffer[24]&0x0f)<<10)
  };
  if(chunk==='VP8 '&&buffer[23]===0x9d&&buffer[24]===0x01&&buffer[25]===0x2a)return {
    width:buffer.readUInt16LE(26)&0x3fff,
    height:buffer.readUInt16LE(28)&0x3fff
  };
  return null;
}
function imageSize(buffer,extension){
  if(extension==='.png')return pngSize(buffer);
  if(extension==='.gif')return gifSize(buffer);
  if(extension==='.jpg'||extension==='.jpeg')return jpegSize(buffer);
  if(extension==='.webp')return webpSize(buffer);
  return null;
}
async function header(path){
  const handle=await open(path,'r');
  try{
    const {size}=await handle.stat();
    const buffer=Buffer.alloc(Math.min(size,262144));
    const {bytesRead}=await handle.read(buffer,0,buffer.length,0);
    return buffer.subarray(0,bytesRead);
  }finally{await handle.close();}
}
export async function readImageDimensions(publicRoot){
  const dimensions={};
  async function walk(directory){
    for(const entry of await readdir(directory,{withFileTypes:true})){
      const path=join(directory,entry.name);
      if(entry.isDirectory()){await walk(path);continue;}
      if(!entry.isFile())continue;
      const extension=extname(entry.name).toLowerCase();
      if(!supported.has(extension))continue;
      const size=imageSize(await header(path),extension);
      if(size?.width>0&&size?.height>0)dimensions[relative(publicRoot,path).split(sep).join('/')]=size;
    }
  }
  await walk(publicRoot);
  return dimensions;
}
