import {CanDeactivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {first, map} from 'rxjs';

export const AuthGuardDeactivate: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);

  return _authService.isConnected().pipe(
    first(),
    map(isConnected => {
      if (isConnected) {
        _router.navigate(['/groupes']);
        return true;
      }
      return false;
    })
  );
};
