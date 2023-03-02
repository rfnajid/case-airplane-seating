const printSeating = (seats, info) => {
    for(let r=0; r<info.maxRow; r++){
        let outputLine = "";
        for (let g = 0; g < seats.length; g++) {
            let groupLine = "";
            for(let c=0; c < seats[g][0].length; c++){
                let char = "__";
                if(r>= seats[g].length){
                    char = "X  ";
                }else if(seats[g][r][c]){
                    char = seats[g][r][c];
                    if(char){
                        char+=" ";
                    }
                }
                groupLine+=char+" ";
            }
            outputLine+=groupLine.padEnd(20);
        }

        console.log(outputLine);
    }
}

const isGroupMiddle = (start, end) => {
    return start>0 && start<end-1;
}

const isMiddleSeat = (c, colCount) => {
    return c>0 && c<colCount-1;
}

const isWindowSeat = (c, colCount, group, groupCount) => {
    let res = false;
    
    if(group==0){
        res = c==0;
    }else if(group==groupCount-1){
        res = c==colCount-1;
    }

    return res;
}

const getInformation = (seatFormat, passengers) => {
    let aisle = 0;
    let window = 0;
    let middle = 0;

    let maxRow = 0;

    // read seat format
    for (let i = 0; i < seatFormat.length; i++) {
        const col = seatFormat[i][0];
        const row = seatFormat[i][1];

        if(row>maxRow){
            maxRow=row;
        }

        if(col==1){
            aisle+=row;
            continue;
        }

        if(isGroupMiddle(i, seatFormat.length)){
            aisle+=(2*row);
        }else{
            aisle+=row;
            window+=row;
        }

        middle+=(col-2)*row;
    }

    return {
        quota: {aisle, window, middle},
        maxRow
    }
}

const generateSeat = (seatFormat, passengerCount, info) => {
    const seats = [];
    const groupLength = seatFormat.length;
    const maxRow = info.maxRow;
    const startQuota = {
        aisle : 0,
        window : info.quota.aisle,
        middle : info.quota.window+info.quota.aisle
    }

    let g = 0;
    let r = 0;
    let c = 0;

    let currentRow = [];

    while(true) {

        const colInGroup = seatFormat[g][0];
        const rowInGroup = seatFormat[g][1];

        if(c>=colInGroup || r>=rowInGroup){
            c=0;
            
            if(currentRow.length>0){
                if(!seats[g]){
                    seats.push([]);
                }
                seats[g].push(currentRow);
            }
            currentRow =[];

            g++;
            if(g==groupLength){
                g=0;
                r++
                if(r==maxRow){
                    break;
                }
            }

            continue;
        }
        
        let value = null;
        if(isMiddleSeat(c, colInGroup)){
            if(startQuota.middle<passengerCount){
                value = ++startQuota.middle;
            }
        }else if(isWindowSeat(c, colInGroup, g, groupLength)){
            if(startQuota.window<passengerCount){
                value = ++startQuota.window;
            }
        }else{
            if(startQuota.aisle<passengerCount){
                value = ++startQuota.aisle;
            }
        }
        currentRow.push(value);

        c++;
    }

    return seats;

}

export const seating = (seatFormat, passengerCount) => {
    
    const info = getInformation(seatFormat, passengerCount);
    
    const seats = generateSeat(seatFormat, passengerCount, info);

    printSeating(seats, info);

}