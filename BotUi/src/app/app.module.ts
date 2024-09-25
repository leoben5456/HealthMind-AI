import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatDividerModule} from '@angular/material/divider';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import {MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import {MatIconModule} from '@angular/material/icon';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FeedbackComponent } from './feedback/feedback.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ShareComponent } from './share/share.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component'; // Import HttpClientModule
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FeedbackComponent,
    ShareComponent,
    AuthComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TooltipModule,
    MatDividerModule,
    MenuModule,
    ToastModule,
    MatMenuModule,
    BrowserAnimationsModule,
    SidebarModule,
    MatIconModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    MatDialogModule,
    RatingModule,
    InputTextareaModule,
    FloatLabelModule,
    ButtonModule,
    FormsModule,
    ClipboardModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule

  ],
  providers: [
    provideAnimationsAsync(),
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
