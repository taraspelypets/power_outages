import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: "root",
})
export class TempFileUploadService {

    constructor(private httpClient: HttpClient) { }

    public uploadTempFile(fileContent: string, filename: string): Observable<any> {
        let path = 'https://tmpfiles.org/api/v1/upload';

        const formData: FormData = new FormData();
        const blob = new Blob([fileContent], { type: 'plain/text' });

        formData.append("file", blob, filename)

        return this.httpClient.post(path, formData).pipe(map((result) => {
            if ((<any>result).status == 'success') {
                let fileUrl: string = (<string>(<any>result).data.url);
                (<any>result).data.url = fileUrl.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
            }

            return result;
        }));
    }

}