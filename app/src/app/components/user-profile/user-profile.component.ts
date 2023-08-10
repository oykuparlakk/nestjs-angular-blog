import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { User } from 'src/app/services/authentication-service/authentication.service';
import { UsersService } from 'src/app/services/user-service/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userId: number | undefined;
  private sub: Subscription = new Subscription(); // Initialize with an empty Subscription
  user: User = {
    name: '',
    username: '',
    email: '',
    password: ''
  }; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService) {

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.userService.findOne(this.userId).pipe(
        map((user: User) => this.user = user)
      ).subscribe(); // Don't forget to subscribe to the observable
    });
  }
}
