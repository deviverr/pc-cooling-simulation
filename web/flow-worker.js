import {solveFlow} from './flow-solver.js?v=4';
import {traceRoomFlow} from './trace-flow.js?v=4';
self.onmessage=e=>{try{const field=solveFlow(e.data.state);const result={...traceRoomFlow(field,e.data.state,e.data.density),maxSpeed:field.maxSpeed,grid:field};self.postMessage({result},[field.permeability.buffer,field.sources.buffer,field.pressure.buffer,field.vx.buffer,field.vy.buffer,field.vz.buffer,field.fx.buffer,field.fy.buffer,field.fz.buffer]);}catch(error){self.postMessage({error:String(error)})}};
