import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm !: FormGroup;

  constructor(private authService: AuthenticationService, private router: Router){}

  ngOnInit():void{

    this.loginForm = new FormGroup({
      email : new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ]),
      password: new FormControl(null,[
        Validators.required,
        Validators.minLength(3),
      ])
    })

  }
  onSubmit(){
    if(this.loginForm.invalid){
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login(email,password).pipe(
      map((token) => this.router.navigate(['admin']))
    ).subscribe();
    
  }

}
