export namespace main {
	
	export class Config {
	    port: string;
	    name: string;
	    department: string;
	    enable_log: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.port = source["port"];
	        this.name = source["name"];
	        this.department = source["department"];
	        this.enable_log = source["enable_log"];
	    }
	}
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
	    CreatedAt: time.Time;
	    UpdatedAt: time.Time;
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
	        this.CreatedAt = this.convertValues(source["CreatedAt"], time.Time);
	        this.UpdatedAt = this.convertValues(source["UpdatedAt"], time.Time);
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
	export class Monitor {
	    id: number[];
	    port: string;
	
	    static createFrom(source: any = {}) {
	        return new Monitor(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.port = source["port"];
	    }
	}

}

export namespace time {
	
	export class Time {
	
	
	    static createFrom(source: any = {}) {
	        return new Time(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

