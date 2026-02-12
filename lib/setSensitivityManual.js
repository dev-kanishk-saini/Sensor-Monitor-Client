// This function sets the sensitivity values manually for motion and static gates by emitting a socket event.


import { getSocket } from "@/lib/socket";


export default function setSensitivityManual(number , motionvalue, staticvalue) {
     const data = {
                 number : number,
                 motiongatevalue : motionvalue,
                 staticgatevalue : staticvalue
               }
               console.log(data);
           getSocket().emit("setsensitivity",data);
              alert("Sensitivity settings applied!");
}