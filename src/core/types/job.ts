export class Job {
    title: string;
    company?: string;
    workType?: string;
    salary?: string;
    level?: string;
    date: Date;
    url: string;
    provider: string;

    constructor(title: string, date: Date, url: string, provider: string, company?: string, workType?: string, salary?: string, level?: string) {
        this.title = title;
        this.company = company;
        this.workType = workType;
        this.salary = salary;
        this.level = level;
        this.date = date;
        this.url = url;
        this.provider = provider;
    }

    static Builder = class {
        private title?: string;
        private company?: string;
        private workType?: string;
        private salary?: string;
        private level?: string;
        private date?: Date;
        private url?: string;
        private provider?: string;
    
        public withTitle(title: string): this {
            this.title = title;
            return this;
        }

        public withCompany(company: string): this {
            this.company = company;
            return this;
        }
        
        public withWorkType(workType: string): this {
            this.workType = workType;
            return this;
        }

        public withSalary(salary: string): this {
            this.salary = salary;
            return this;
        }
        
        public withLevel(level: string): this {
            this.level = level;
            return this;
        }

        public withDate(date: Date): this {
            this.date = date;
            return this;
        }

        public withUrl(url: string): this {
            this.url = url;
            return this;
        }

        public withProvider(provider: string): this {
            this.provider = provider;
            return this;
        }

        public build(): Job {
            if (!this.title || !this.date || !this.url || !this.provider)
                throw new Error("Title, date, url and provider are required");

            return new Job(this.title, this.date, this.url, this.provider, this.company, this.workType, this.salary, this.level);
        }
    }
}
