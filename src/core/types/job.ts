export class Job {
    name: string;
    company?: string;
    field: string;
    workType?: string;
    salary?: string;
    level?: string;
    date: Date;
    url: string;

    provider: string; 

    constructor(name: string, field: string, date: Date, url: string, company?: string, workType?: string, salary?: string, level?: string) {
        this.name = name;
        this.company = company;
        this.field = field;
        this.workType = workType;
        this.salary = salary;
        this.level = level;
        this.date = date;
        this.url = url;
        this.provider = this.getProvider();
    }

    private getProvider(): string {
        if (this.url.startsWith('https://github.com/backend-br/vagas')) {
            return 'backend-br';
        }
    
        if (this.url.startsWith('https://github.com/frontendbr/vagas')) {
            return 'frontendbr';
        }

        return 'unknown';
    }
}