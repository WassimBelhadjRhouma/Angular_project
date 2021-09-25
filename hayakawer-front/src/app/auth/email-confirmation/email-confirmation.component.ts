import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  loader = true;
  public emailCode = '';
  public codeResponse: number = null;
  public emailConfirmed = false;
  public expiredEmailCode = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params: Params) => {
      this.emailCode = params.emailCode;
      this.authService.emailConfirmation(this.emailCode)
        .then((res) => {
          this.codeResponse = res.code;
        })
        .catch((err) => {
          this.codeResponse = -1;
        }).finally(() => {
          this.loader = false;
        });
    });

  }

}
