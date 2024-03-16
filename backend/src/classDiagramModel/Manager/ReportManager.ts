import { Report } from "../Report";

export class ReportManager{
    public constructor(){

    }

    public createReport(senderId: string, receiverId: string, description: string, createAt: string): Report {
        return new Report(senderId, receiverId, description, createAt);
    }

    public send(report: Report): void{
        //code here
    }
}