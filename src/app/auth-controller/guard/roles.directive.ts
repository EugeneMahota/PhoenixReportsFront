import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';

@Directive({
  selector: '[appRoles]'
})
export class RolesDirective {


  @Input() appRoles: Array<string>;

  constructor(private authService: AuthService, private viewContainerRef: ViewContainerRef,
              private template: TemplateRef<any>) {
  }

  ngOnInit() {
    let role = this.authService.getRole();
    this.checkRoles(role);
  }

  checkRoles(role) {
    let status = false;

    for (let i = 0; i < role.length; i++) {
      if (!this.appRoles || this.appRoles.indexOf(role[i]) != -1) {
        status = true;
      }
    }
    if (status) {
      this.viewContainerRef.createEmbeddedView(this.template);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
