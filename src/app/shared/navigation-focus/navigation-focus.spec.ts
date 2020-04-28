import {Component, NgZone} from '@angular/core';
import {ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {NavigationFocusService} from './navigation-focus.service';

describe('Navigation focus service', () => {
  let navigationFocusService: NavigationFocusService;
  let router: Router;
  let zone: NgZone;
  let fixture: ComponentFixture<NavigationFocusTest>;

  const navigate = (url: string) => {
    zone.run(() => router.navigateByUrl(url));
    tick(100);
  };

  beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([
          {path: '', component: RouteTest},
          {path: 'cdk', component: RouteTest},
          {path: 'guides', component: RouteTest}
        ])],
        providers: [NavigationFocusService],
        declarations: [NavigationFocusTest, RouteTest],
      });
      fixture = TestBed.createComponent(NavigationFocusTest);
    }
  );

  beforeEach(inject(
      [NgZone, Router, NavigationFocusService],
      (_zone: NgZone, _router: Router, nfs: NavigationFocusService) => {
    zone = _zone;
    router = _router;
    navigationFocusService = nfs;
  }));

  fit('should focus on component then relinquish focus', fakeAsync(() => {
    const target1 = fixture.nativeElement.querySelector('#target1');
    const target2 = fixture.nativeElement.querySelector('#target2');

    // First navigation event doesn't trigger focus because it represents a hardnav.
    navigationFocusService.requestFocusOnNavigation(target1);
    navigationFocusService.requestFocusOnNavigation(target2);
    navigate('/');
    expect(document.activeElement).not.toEqual(target1);
    expect(document.activeElement).not.toEqual(target2);

    // Most recent requester gets focus on the next nav.
    navigate('/guides');
    expect(document.activeElement).toEqual(target2);

    // Falls back to the focusing the previous requester once the most recent one relinquishes.
    navigationFocusService.relinquishFocusOnDestroy(target2);
    navigate('/cdk');
    expect(document.activeElement).toEqual(target1);
  }))
});

@Component({
  selector: 'navigation-focus-test',
  template: `
    <button id="target1">Target 1</button>
    <button id="target2">Target 2</button>
  `
})
class NavigationFocusTest {}

@Component({
  selector: 'route-test',
  template: '',
})
class RouteTest {}
