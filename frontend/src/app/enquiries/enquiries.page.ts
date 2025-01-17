import { Component, OnInit, ViewChild } from '@angular/core';
import { EnquiryTopic } from '../shared/enums/enquiry';
import { User } from '../shared/interface/user';
import { UserService } from '../user/user.service';
import { EnquiriesListComponent } from './enquiries-list/enquiries-list.component';

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.page.html',
  styleUrls: ['./enquiries.page.scss'],
})
export class EnquiriesPage implements OnInit {

  @ViewChild(EnquiriesListComponent) enquiriesList: EnquiriesListComponent;
  public progressBar = false;
  public search = '';
  public filterBy: string[] = [];
  public filters = [
    {
      value: EnquiryTopic.info,
      label: 'Information'
    },
    {
      value: EnquiryTopic.sales,
      label: 'Sales'
    },
    {
      value: EnquiryTopic.schedule,
      label: 'Schedule'
    },
    {
      value: EnquiryTopic.payment,
      label: 'Payment'
    },
    {
      value: 'sent',
      label: 'Sent'
    },
    {
      value: 'received',
      label: 'Received'
    },
  ];
  public sortBy = 'latest';
  public sorts = [
    {
      value: 'latest',
      label: 'Latest'
    },
    {
      value: 'oldest',
      label: 'Oldest'
    },
    {
      value: 'title',
      label: 'Title'
    },
  ];
  public user: User;


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => this.user = user);
  }

  ionViewDidEnter() {
    if (this.user) {
      this.enquiriesList.onParentDidEnter();
    }
  }

  public async setLoading(val: boolean) {
    this.progressBar = val;
  }

  setFilterSort(data: { filterBy: string[], sortBy: string }) {
    this.filterBy = data.filterBy;
    this.sortBy = data.sortBy;
  }

}
