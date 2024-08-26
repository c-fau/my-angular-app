import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
@Component({
  selector: 'app-cam-feed',
  standalone: true,
  imports: [],
  templateUrl: './cam-feed.component.html',
  styleUrl: './cam-feed.component.scss',
})
export class CamFeedComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLImageElement>;
  private websocket!: WebSocket;

  ngOnInit(): void {
    // Optionally auto-start the video feed
    // this.startVideoFeed();
  }

  startVideoFeed(): void {
    this.websocket = new WebSocket('ws://raspberrypi:8000/ws/video');

    this.websocket.onmessage = (event) => {
      const binary = new Uint8Array(event.data);
      const base64String = btoa(String.fromCharCode(...binary));
      this.videoElement.nativeElement.src = `data:image/jpeg;base64,${base64String}`;
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  stopVideoFeed(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  ngOnDestroy(): void {
    this.stopVideoFeed(); // Ensure the WebSocket is closed when the component is destroyed
  }
}
