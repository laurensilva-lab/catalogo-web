import {put,list} from '@vercel/blob';
export default async function handler(req,res){
 try{
  const pw=(process.env.ADMIN_PASSWORD||'').trim();
  const ok=!!pw&&String(req.headers['x-admin']||'').trim()===pw;
  if(req.query.check)return res.status(ok?200:401).json({ok,configured:!!pw,blob:!!process.env.BLOB_READ_WRITE_TOKEN});
  if(req.method==='POST'){
   if(!ok)return res.status(401).json({error:'Clave incorrecta'});
   const body=typeof req.body==='string'?req.body:JSON.stringify(req.body);
   await put('catalog.json',body,{access:'public',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',cacheControlMaxAge:60});
   return res.json({ok:true});
  }
  const {blobs}=await list({prefix:'catalog.json'});
  res.setHeader('Cache-Control','no-store');
  if(!blobs.length)return res.json(null);
  const r=await fetch(blobs[0].url+'?t='+Date.now());
  res.setHeader('Content-Type','application/json');
  res.send(await r.text());
 }catch(e){res.status(500).json({error:String(e.message||e)})}
}
