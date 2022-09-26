export let cameraSerialumber: string = ''
export let galcSerialNumber: string = '';

export function dataFromCamera(camData: string){
    console.log("main: in dataFromCamera function:", cameraSerialumber);
    cameraSerialumber = camData;
    compareAndSend();
}

export function dataFromGALC(galcData: string){
    console.log("main: in dataFromGALC function", galcSerialNumber);
    galcSerialNumber = galcData;
}

export function compareAndSend(){
    console.log("main: in compareAndSend function");
    if(galcSerialNumber === cameraSerialumber){
        console.log("main: serial number matched");
        
    }else if(galcSerialNumber === '' &&  cameraSerialumber === ''){
        console.log("main: empty galc & camera serial number");
        
    }else if(galcSerialNumber === ''){
        console.log("main: empty galc serial number");
        
    }else if(cameraSerialumber === ''){
        console.log("main: empty camera serial number");
        
    }else if(galcSerialNumber != cameraSerialumber){
        console.log("main: serial number unmatched");
        
    }
}
