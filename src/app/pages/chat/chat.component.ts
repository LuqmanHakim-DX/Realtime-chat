import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat-service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { ModalComponent } from '../../layout/modal/modal-component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, DatePipe, ModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private chat_service = inject(ChatService);
  private auth = inject(AuthService);
  chatForm!: FormGroup;
  private fb = inject(FormBuilder);
  chats = signal<Ichat[]>([]);
  private router = inject(Router);
  currentUserId: string | null = null;

  constructor() {
    effect(() => {
      this.onListChat();
    });
  }

  onListChat() {
    this.chat_service
      .listChat()
      .then((res: Ichat[] | null) => {
        console.log(res);
        if (res !== null) {
          this.chats.set(res);
        } else {
          console.log('No messages Found');
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  async ngOnInit() {
    this.chatForm = this.fb.group({
    chat_message: ['', Validators.required],
    });

    const user = await this.auth.getCurrentUser();
    this.currentUserId = user?.id ?? null;
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message;
    this.chat_service
      .chatMessage(formValue)
      .then((res) => {
        this.chatForm.reset();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
  
   openDropDown(msg: Ichat) {
    console.log(msg);
    this.chat_service.selectedChats(msg);
  }

  async logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}