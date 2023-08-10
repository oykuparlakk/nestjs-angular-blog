import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, Observable, switchMap, tap } from 'rxjs';
import { AuthenticationService, User } from 'src/app/services/authentication-service/authentication.service';
import { UsersService } from 'src/app/services/user-service/users.service';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent {

  form!: FormGroup; 

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UsersService,
  ){}


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: [null]
    });
    const userIdObservable: Observable<number> = from(this.authService.getUserId());
    userIdObservable.pipe(
      switchMap((id: number) => this.userService.findOne(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
          });
        })
      ))
    ).subscribe();
  }


  update() {
    this.userService.updateOne(this.form.getRawValue()).subscribe();
  }
}