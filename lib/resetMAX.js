// here we have to write the functions for resetting max data  values in the charts.
import { getSocket } from "./socket";

export   function resetMaxmotion() {

    getSocket().emit("resetmaxvaluemotion");

}

export  function resetMaxstatic() {

    getSocket().emit("resetmaxvaluestatic");

}



