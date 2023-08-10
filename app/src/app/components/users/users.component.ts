import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { UserData, UsersService } from 'src/app/services/user-service/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  pageEvent : PageEvent | undefined;
  dataSource:UserData | undefined;
  displayedColumns: string[] = ['id','name','username','email', 'role'];

  constructor(
    private userService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){}

  ngOnInit():void{
    this.initDataSource();
  }
  initDataSource(){
    this.userService.findAll(1,10).pipe(
    tap(users => console.log(users)),
    map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page +1;
    this.userService.findAll(page,size).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  navigateToProfile(id:number){
    this.router.navigate(['./' + id],{relativeTo: this.activatedRoute})
  }
}
