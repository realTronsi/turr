export function sendPacket(ws, payload){
  try{
	  ws.send(msgpack.encode(payload));
  }
  catch(err){
    console.log(err);
  }
}