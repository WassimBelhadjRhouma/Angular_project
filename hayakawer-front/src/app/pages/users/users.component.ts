import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PagesService } from 'src/app/core/service/pages.service';
import { UsersService } from 'src/app/core/service/users.service';
import { pages } from 'src/app/core/utiles/pages.utils';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  page = 1;
  total = 0;
  limit = 8;
  pageSize = 7;

  users = [];

  filterNameEmail = null;

  constructor(
    private pagesService: PagesService,
    private usersService: UsersService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {

    this.pagesService.setCurrentIndex(pages.pagesRef.users);
    this.usersService.getUsers({ filter: { $nor: [{ userType: 'admin' }] }, limit: this.limit }) // $nor is mongodb operator
      .then((res) => {
        this.users = res.users.data;
        this.total = res.users.total;
      })
      .catch((err) => console.log(err));
  }

  pageChanged(e) {
    this.page = e;
    this.usersService.getUsers({
      limit: this.limit,
      page: this.page,
      filter: { $nor: [{ userType: 'admin' }] }
    })
      .then((res) => {
        this.users = res.users.data;
      })
  }

  deleteUser(user): void {
    this.usersService.deleteUser(user._id)
      .then((res) => {
        if (res.code === 1) {
          // this.toastr.success('user deleted');
          if (this.users.length === 1 && this.page > 1) {
            this.page = this.page - 1;
          }
          this.usersService.getUsers({ filter: { $nor: [{ userType: 'admin' }] }, limit: this.limit, page: this.page })
            .then((res) => {
              this.users = res.users.data;
              this.total = res.users.total;
            })
            .catch((err) => this.toastr.warning('something went wrong, try again later'));
        }
      });
  }

  blockUnblock(user, action = ''): void {
    this.usersService.updateUser({
      id: user._id, user: {
        isBlocked: action === 'block' ? true : false
      }
    })
      .then((res) => {
        if (res.code === 1) {
          this.users.forEach((usr) => {
            if (usr._id === user._id) {
              usr.isBlocked = action === 'block' ? true : false;
            }
          })
        }
      });
  }

  filterName(filterValue: string) {
    this.usersService.getUsers({
      filter: {
        $nor: [{ userType: 'admin' }],
        $or: [
          { firstName: { "$regex": filterValue.trim(), "$options": "i" } },
          { lastName: { "$regex": filterValue.trim(), "$options": "i" } },
          { email: { "$regex": filterValue.trim(), "$options": "i" } },
        ]

      }, limit: this.limit
    })
      .then((res) => {
        this.users = res.users.data;
        this.total = res.users.total;
      });
  }
}
