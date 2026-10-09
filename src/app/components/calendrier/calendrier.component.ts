import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import {CalendarOptions, EventInput, EventSourceInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {FormsModule} from '@angular/forms';
import {AsideBarComponent} from '../aside-bar/aside-bar.component';
import timegridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {CalendarService} from '../../services/calendar/calendar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Calendar} from '../../model/calendar/calendar.model';


@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, AsideBarComponent],
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss'],
})
export class CalendrierComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  roomId: number;
  calendar: Calendar[] = [];
  constructor(private _router: Router, private _route: ActivatedRoute,private calendarService: CalendarService) {
    this.roomId = Number(this._route.snapshot.paramMap.get('id'));
  }

  showAddEventModal: boolean = false; // Gère l'affichage de la pop-up
  eventTitle: string = ''; // Titre de l'événement
  eventStart: Date  = new Date; // Date et heure de début
  eventEnd: Date = new Date; // Date et heure de fin


  selectedEvent: any = null; // L'événement sélectionné
  selectedEventStart: string | null = null; // Date de début formatée
  selectedEventEnd: string | null = null; // Date de fin formatée

  appointmentTypes = [
    { type: 'Médical', color: '#ff0000' }, // Rouge
    { type: 'Familial', color: '#00ff00' }, // Vert
    { type: 'Professionnel', color: '#0000ff' } // Bleu
  ];

  selectedAppointmentType: string = '';

  calendarOptions: CalendarOptions = {

    selectable: true, // Permet de sélectionner uniquement pendant les horaires
    dateClick: this.handleDateClick.bind(this),
    plugins: [dayGridPlugin, timegridPlugin,interactionPlugin, listPlugin],
    eventConstraint: {
      start: new Date().toISOString().split('T')[0], // Date actuelle
      end: '2100-01-01' // Date future éloignée
    },
    selectAllow: function(selectInfo) {
      return selectInfo.start >= new Date();
    },

    initialView: 'dayGridMonth',
    expandRows: true,
    height: '90%',
    firstDay: 1,
    editable: false,
    eventClick: (info) => this.onEventClick(info),
    droppable: true,
    locale: 'fr',
    eventResizableFromStart: true,

    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek addEventButton', // Ajoute les boutons pour changer de vue      center: 'title',
      center: 'title',
      right: 'prev,next today',
    },
    customButtons: {
      addEventButton: {
        text: 'Ajouter événement',
        click: () => this.openAddEventModal(),
      },

    },

    slotDuration: '00:00:00', // Intervalle des créneaux horaires (30 minutes)
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Format des heures

    events: [
      { title: 'Meeting', start: new Date('2025-01-06T15:00:00') }, // Exemple avec heure précise
    ],
  };

  // Change dynamically between views


  loadTaches(): void {
    this.calendarService.getAllTaches(this.roomId).subscribe(
      (taches: Calendar[]) => {
        this.calendar = taches;
        console.log('Tâches récupérées:', this.calendar);

        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();

        this.calendar.forEach(tache => {
          if (tache.start_date && tache.end_date) {
            const eventData = {
              id: String(tache.id),
              title: tache.title,
              start: new Date(tache.start_date), // Assurer ISO 8601
              end: new Date(tache.end_date),
              color: this.getEventColor(tache.type),
              extendedProps: { type: tache.type }
            };
            if(tache.id == -1){
              eventData.color = '#00FFFF';
            }

            calendarApi.addEvent(eventData);
          } else {
            console.error("Erreur : tache.start_date ou tache.end_date est invalide", tache);
          }
        });

        calendarApi.changeView('dayGridMonth');
      },
      (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    );
  }


  getEventColor(eventType: string): string {
    const appointmentTypes = [
      { type: 'Médical', color: '#ff0000' }, // Rouge
      { type: 'Familial', color: '#00ff00' }, // Vert
      { type: 'Professionnel', color: '#0000ff' } // Bleu
    ];

    const selectedType = appointmentTypes.find(appointment => appointment.type === eventType);
    return selectedType ? selectedType.color : '#000000'; // Couleur par défaut noire si non trouvé
  }

  addEvent(): void {

    if (this.eventTitle && this.isDateTimeValid(this.eventStart, this.eventEnd)) {
      // Trouver la couleur associée au type de rendez-vous sélectionné
      const selectedType = this.appointmentTypes.find(
        appointment => appointment.type === this.selectedAppointmentType
      );

      const eventColor = selectedType ? selectedType.color : '#000000'; // Couleur par défaut

      // Construire l'objet de données à envoyer
      const eventData = {
        title: this.eventTitle,
        start_date: new Date(this.eventStart),
        end_date: new Date(this.eventEnd),
        type: this.selectedAppointmentType,
        roomId: this.roomId
      };

      // Appel au service pour envoyer l'événement au backend
      this.calendarService.addEvent(eventData).subscribe(
        (response) => {
          console.log('Événement ajouté avec succès :', response);

          const calendarApi = this.calendarComponent.getApi();
          calendarApi.addEvent({
            title: this.eventTitle,
            start: new Date(this.eventStart),
            end: new Date(this.eventEnd),
            color: eventColor
          });

          // Réinitialiser les champs après l'ajout
          this.eventTitle = '';
          this.eventStart = new Date();
          this.eventEnd = new Date();
          this.selectedAppointmentType = '';
          this.closeAddEventModal();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'événement :', error);
        }
      );
    } else {
      console.error('Données de l\'événement invalides. Veuillez vérifier le formulaire.');
    }
  }


  isDateTimeValid(start: Date | null, end: Date | null): boolean {
    if (!start || !end) return false; // Les deux dates doivent être présentes
    if (start >= end) return false; // La date de début doit être avant la date de fin
    return true;
  }

  handleDateClick(arg: any): void {
    const currentDate = new Date();
    const clickedDate = new Date(arg.date);
    clickedDate.setHours(12, 0, 0, 0);
    const today = new Date(currentDate.setHours(0, 0, 0, 0));

    if (clickedDate < today) {
      alert("Vous ne pouvez pas créer d'événements dans le passé.");
      return;
    }

    const title = prompt("Entrez le titre de l'événement :");
    if (!title) {
      return;
    }

    // Sélection du type de rendez-vous
    const selectedType = prompt("Entrez le type de rendez-vous (ex: Médical, Familial,Professionnel) :");
    if (!selectedType) {
      return;
    }

    // Trouver la couleur associée au type de rendez-vous
    const appointmentType = this.appointmentTypes.find(
      appointment => appointment.type === selectedType
    );
    const eventColor = appointmentType ? appointmentType.color : '#ff0000'; // Couleur par défaut


    const eventData = {
      title,
      start_date: clickedDate.toISOString(),
      end_date: clickedDate.toISOString(),
      type: selectedType,
      roomId: this.roomId
    };

    // Envoi au backend
    this.calendarService.addEvent(eventData).subscribe(
      (response) => {
        console.log("Événement ajouté avec succès :", response);

        // Ajout à l'affichage du calendrier
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.addEvent({
          title,
          start: arg.date,
          allDay: arg.allDay,
          color: eventColor
        });
      },
      (error) => {
        console.error("Erreur lors de l'ajout de l'événement :", error);
      }
    );
  }




  onEventClick(info: any): void {
    const eventId = info.event.id;

    if(eventId == "-1"){
      alert("Pour modifier une tâche provenant du kanban, veuillez la modifier directement dans le kanban.");
      return;
    }
    this.selectedEvent = info.event; // Récupère l'événement cliqué
    this.selectedEventStart = info.event.start?.toISOString().slice(0, 16); // Format pour datetime-local
    this.selectedEventEnd = info.event.end?.toISOString().slice(0, 16); // Format pour datetime-local
  }

  updateEvent(): void {
    if (this.selectedEvent && this.selectedEventStart && this.selectedEventEnd) {
      const updatedFields: any = {};

      updatedFields.title = this.selectedEvent.title;


      updatedFields.start_date = new Date(this.selectedEventStart);
      updatedFields.end_date = new Date(this.selectedEventEnd);

      updatedFields.type = this.selectedEvent.type;

      if (Object.keys(updatedFields).length === 0) {
        console.log("Aucune modification détectée.");
        return;
      }

      const eventToUpdate = this.calendar.find(event => event.title === this.selectedEvent.title);
      if (!eventToUpdate) {
        console.error("Aucun événement trouvé avec ce titre.");
        return;
      }

      this.calendarService.updateEvent(eventToUpdate.id, updatedFields, this.roomId).subscribe(
        (response) => {
          console.log('Événement mis à jour avec succès:', response);


          this.selectedEvent.setProp('title', response.title);
          this.selectedEvent.setStart(new Date(response.start_date).toISOString());
          this.selectedEvent.setEnd(new Date(response.end_date).toISOString());

          this.cancelEdit();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'événement :', error);
        }
      );
    } else {
      console.error('Données de l\'événement invalides.');
    }
  }




  cancelEdit(): void {
    this.selectedEvent = null;
    this.selectedEventStart = null;
    this.selectedEventEnd = null;
  }

  toggleEditable(event: any): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.setOption('editable', event.target.checked);
  }

  resetEventForm(): void {
    this.eventTitle = '';
    this.eventStart = new Date();
    this.eventEnd = new Date();
    this.selectedAppointmentType = '';
  }


  openAddEventModal() {
    this.showAddEventModal = true;
    console.log(this.showAddEventModal);
  }

  closeAddEventModal() {
    this.showAddEventModal = false;
    this.resetEventForm();
  }

  ngOnInit() {
    this.updateCalendarView(window.innerWidth);
    this.loadTaches();
    window.addEventListener('resize', () => {
      this.updateCalendarView(window.innerWidth);
    });
  }

  updateCalendarView(width: number) {
    const calendarApi = this.calendarComponent?.getApi();

    if (width < 600) {
      this.calendarOptions.headerToolbar = {
        left: 'dayGridMonth timeGridDay listWeek addEventButton',
        center: 'title',
        right: 'prev,next today'
      };
      calendarApi?.changeView('timeGridDay'); // Basculer à listWeek
    } else {
      this.calendarOptions.headerToolbar = {
        left: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek addEventButton',
        center: 'title',
        right: 'prev,next today'
      };
      calendarApi?.changeView('dayGridMonth'); // Vue par défaut pour grand écran
    }

    // Appliquer les changements à l'interface
    calendarApi?.setOption('headerToolbar', this.calendarOptions.headerToolbar);
  }

  deleteEvent():void{
    const eventToDelete = this.calendar.find(event => event.title === this.selectedEvent.title);
    if (!eventToDelete) {
      console.error("Aucun événement trouvé avec ce titre.");
      return;
    }

    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.calendarService.deleteEvent(eventToDelete.id).subscribe({
        next: () => {
          console.log('Tâche supprimée');
          this.loadTaches();
          this.selectedEvent = null;
        },
        error: (err) => console.error('Erreur :', err)
      });
    }
  }


}

