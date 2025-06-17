export namespace main {
	
	export class Filter {
	    limit: number;
	    page?: number;
	    next_page?: number;
	    previous_page?: number;
	    count: number;
	    total_page: number;
	    search?: string;
	    OrderBy: string;
	    Order: string;
	
	    static createFrom(source: any = {}) {
	        return new Filter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.limit = source["limit"];
	        this.page = source["page"];
	        this.next_page = source["next_page"];
	        this.previous_page = source["previous_page"];
	        this.count = source["count"];
	        this.total_page = source["total_page"];
	        this.search = source["search"];
	        this.OrderBy = source["OrderBy"];
	        this.Order = source["Order"];
	    }
	}
	export class FindAllRequest {
	    limit: number;
	    page: number;
	    search: string;
	    sort_by: string;
	    sort: string;
	
	    static createFrom(source: any = {}) {
	        return new FindAllRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.limit = source["limit"];
	        this.page = source["page"];
	        this.search = source["search"];
	        this.sort_by = source["sort_by"];
	        this.sort = source["sort"];
	    }
	}
	export class Measurement {
	    ID: number;
	    // Go type: time
	    CreatedAt: any;
	    // Go type: time
	    UpdatedAt: any;
	    // Go type: gorm
	    DeletedAt: any;
	    full_name: string;
	    patient_id: string;
	    weight: number;
	    height: number;
	    bmi: number;
	
	    static createFrom(source: any = {}) {
	        return new Measurement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.CreatedAt = this.convertValues(source["CreatedAt"], null);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], null);
	        this.DeletedAt = this.convertValues(source["DeletedAt"], null);
	        this.full_name = source["full_name"];
	        this.patient_id = source["patient_id"];
	        this.weight = source["weight"];
	        this.height = source["height"];
	        this.bmi = source["bmi"];
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
	export class MeasurementResponse___main_Measurement_ {
	    data: Measurement[];
	    meta: Filter;
	
	    static createFrom(source: any = {}) {
	        return new MeasurementResponse___main_Measurement_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], Measurement);
	        this.meta = this.convertValues(source["meta"], Filter);
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

