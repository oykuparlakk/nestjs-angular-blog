import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, pipe } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
class CustomValidators{
  static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
    const regex = /\d/;
    const value = control.value;
  
    if (typeof value === 'string' && regex.test(value) && value !== null) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  static passwordMatch(control: AbstractControl): ValidationErrors | null{
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    if((password === passwordConfirm) && (password !== null && passwordConfirm !== null)){
      return null;
    }else{
      return {passwordNotMatching:true};
    }
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm!: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
    ){
  }

  ngOnInit():void{
    this.registerForm = this.formBuilder.group({
      name:[null,[Validators.required]],
      username:[null,[Validators.required]],
      email:[null,[
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ]],
      password:[null,[
        Validators.required,
        Validators.minLength(3),
        CustomValidators.passwordContainsNumber
      ]],
      passwordConfirm:[null,[Validators.required]]
    },{
      validators: CustomValidators.passwordMatch
    })
  }

  onSubmit(){
    if(this.registerForm?.invalid){
      return;
    }
    this.authService.register(this.registerForm.value).pipe(
      map(user=> this.router.navigate(['login']))
    ).subscribe();
  }
}
