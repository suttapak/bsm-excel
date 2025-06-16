export namespace serial {
	
	export class ModemOutputBits {
	    RTS: boolean;
	    DTR: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ModemOutputBits(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.RTS = source["RTS"];
	        this.DTR = source["DTR"];
	    }
	}
	export class Mode {
	    BaudRate: number;
	    DataBits: number;
	    Parity: number;
	    StopBits: number;
	    InitialStatusBits?: ModemOutputBits;
	
	    static createFrom(source: any = {}) {
	        return new Mode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.BaudRate = source["BaudRate"];
	        this.DataBits = source["DataBits"];
	        this.Parity = source["Parity"];
	        this.StopBits = source["StopBits"];
	        this.InitialStatusBits = this.convertValues(source["InitialStatusBits"], ModemOutputBits);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

