import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-places';

  constructor(public auth: AuthService) {

    // get id token
    this.auth.idTokenClaims$.subscribe(
      (token) => {
        console.log(`token_id = ${token.__raw}`);
        // Save token_id in localStorage
        localStorage.setItem('token_id', `${token.__raw}`);
      }
    )

  }
}
