import {CanActivateFn, CanDeactivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { first, map } from 'rxjs';

export const AuthGuardCanActivate: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  return _authService.isConnected().pipe(
    first(),
    map(isConnected => {
      if (!isConnected) {
        _router.navigate(['/connexion']);
        return false;
      }
      return true;
    })
  );
};



