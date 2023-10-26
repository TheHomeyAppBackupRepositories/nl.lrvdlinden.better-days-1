const { App } = require('homey');
const Homey = require('homey');
  
class BetterDays extends Homey.App {

    // -------------------- INIT ----------------------
    async onInit() {
        this.sendNotifications();
    }

    // -------------------- Notification updates ----------------------
    async sendNotifications() {
        try {
            //const ntfy2023100401 = `It's time to set up a **party**!`;

            //await this.homey.notifications.createNotification({
            //excerpt: ntfy2023100401
            //});
        } catch (error) {
            this.log('sendNotifications - error', error); 
        }

 // -------------------- Trigger cards ----------------------

 this.homey.flow.getTriggerCard('countdown_timer_ended')
 .registerRunListener(async (args, state) => {
     if(args.event === state.event) {
         this.log(`Countdown Timer ended for ${args.event}`);
         return true;
     }
     return false;
 });
 
 
 this.homey.flow.getTriggerCard('today_is_a_day')
 .registerRunListener(async (args, state) => {
     // Het verkrijgen van de huidige dag van de week
     const currentDate = new Date();
     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     const today = days[currentDate.getUTCDay()];
 
     // Log voor debugging
     this.log(`Selected day: ${args.dayOfWeek}`);
     this.log(`Current day: ${today}`);
 
     // Controleer of de huidige dag overeenkomt met de geselecteerde dag
     if (args.dayOfWeek === today) {
         this.log(`Triggering because today is a ${today}`);
         return Promise.resolve(true);  // Dit betekent dat de flow verder moet gaan
     } else {
         this.log(`Not triggering because today is not a ${args.dayOfWeek}, it's a ${today}`);
         return Promise.resolve(false);  // Dit betekent dat de flow niet moet verdergaan
     }
 });
 
 
 function getNthWeekdayOfMonth(month, n, weekday) {
  let date = new Date(new Date().getFullYear(), month, 1);
  let count = 0;

  while (count < n) {
      if (date.getDay() === weekday) {
          count++;
      }

      if (count < n) {
          date.setDate(date.getDate() + 1);
      }
  }

  return date.getDate();
}

this.homey.flow.getTriggerCard('dutch-flag-day')
.registerRunListener(async (args, state) => {
 const timeZone = 'Europe/Amsterdam';
 const currentDate = new Date();
 const today = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(currentDate).split('/');
 const currentMonth = parseInt(today[0]);
 const currentDay = parseInt(today[1]);

 const holidays = [
  { name: "Verjaardag prinses Beatrix", month: 0, day: 31 },
  { name: "Koningsdag", month: 3, day: 27 },
  { name: "Dodenherdenking", month: 4, day: 4 },
  { name: "Bevrijdingsdag", month: 4, day: 5 },
  { name: "Verjaardag koningin Máxima", month: 4, day: 17 },
  { name: "Veteranendag", month: 5, week: -1, day: 6 },
  { name: "Formeel einde Tweede Wereldoorlog", month: 7, day: 15 },
  { name: "Prinsjesdag", month: 8, week: 3, day: 2 },
  { name: "Verjaardag prinses Catharina-Amalia", month: 11, day: 7 },
  { name: "Koninkrijksdag", month: 11, day: 15 }
 ];

 for (const holiday of holidays) {
   if (holiday.week) {
      if (holiday.month === currentMonth && getNthWeekdayOfMonth(currentMonth, holiday.week, holiday.day) === currentDay) {
          this.homey.flow.getTriggerCard('dutch-flag-day').trigger({
              flagDay: holiday.name
          });
          return Promise.resolve(true);
      }
  } else if (holiday.month === currentMonth && holiday.day === currentDay) {
      this.homey.flow.getTriggerCard('dutch-flag-day').trigger({
          flagDay: holiday.name
      });
      return Promise.resolve(true);
  }
 }
 return Promise.resolve(false);
});

 


// this.homey.flow.getTriggerCard('trigger_every')
//  .registerRunListener(async (args, state) => {
//    const { number, dropdown } = args;

//    if (typeof number === 'number' && !isNaN(number) && number > 0) {
//      // Voer de trigger uit op basis van het geselecteerde interval
//      const interval = calculateInterval(number, dropdown);
//      if (interval) {
//        return true;
//      }
//    }

//    return false;
//  });

// function calculateInterval(number, dropdown) {
//  // Bepaal het tijdsinterval op basis van het geselecteerde aantal en eenheid
//  switch (dropdown) {
//    case 'Seconds':
//      return true; // Trigger elke x seconden
//    case 'Minutes':
//      return true; // Trigger elke x minuten
//    case 'Hours':
//      return true; // Trigger elke x uur
//    case 'Days':
//      return true; // Trigger elke x dagen
//    case 'Months':
//      return true; // Trigger elke x maanden
//    default:
//      return false;
//  }
// }




// this.homey.flow.getTriggerCard('dutch-flag-day-trigger')
//   .registerRunListener(async (args, state) => {
//     const { time } = args;

//     // Haal de huidige datum en tijd op
//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();

//     // Bepaal de tijd waarop je wilt controleren
//     const triggerTimeParts = time.split(':');
//     const triggerHour = parseInt(triggerTimeParts[0]);
//     const triggerMinute = parseInt(triggerTimeParts[1]);

//     // Controleer of de huidige tijd overeenkomt met de opgegeven tijd
//     if (currentHour === triggerHour && currentMinute === triggerMinute) {
//       // Controleer of het ook een Nederlandse vlagdag is
//       const flagDays = [
//         { month: 0, day: 31 },      // 31 januari
//         { month: 3, day: 27 },      // 27 april
//         { month: 4, day: 4 },       // 4 mei (Dodenherdenking)
//         { month: 4, day: 5 },       // 5 mei (Bevrijdingsdag)
//         { month: 4, day: 17 },      // 17 mei
//         { month: 5, week: -1, day: 6 },  // Laatste zaterdag in juni (Veteranendag)
//         { month: 7, day: 15 },      // 15 augustus
//         { month: 8, week: 2, day: 2 },   // 3e dinsdag in september (Prinsjesdag)
//         { month: 11, day: 7 }       // 7 december
//       ];

//       for (const date of flagDays) {
//         if (date.month === now.getMonth() && (date.day === now.getDate() || (date.week && date.week === getNthWeekdayOfMonth(now, date.day)))) {
//           return true;
//         }
//       }
//     }

//     return false;
//   });



    // -------------------- Condition cards ----------------------                       
            
            this.homey.flow.getConditionCard('today_is_a_day')
            .registerRunListener(async (args, state) => {
              const { dayOfWeek } = args;
              const today = new Date();
              const currentDayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

              if (dayOfWeek === currentDayOfWeek) {
                return Promise.resolve(true);
              } else {
                return Promise.resolve(false);
              }
            });
              

            this.homey.flow.getConditionCard('today_is_a_weekend')
            .registerRunListener(async (args, state) => {
               const today = new Date();
               const currentDayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

               if (currentDayOfWeek === 'Saturday' || currentDayOfWeek === 'Sunday') {
                 return Promise.resolve(true);
               } else {
                 return Promise.resolve(false);
               }
            });

            this.homey.flow.getConditionCard('today_is_a_working_day')
            .registerRunListener(async (args, state) => {
              const today = new Date();
              const currentDayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });

              if (currentDayOfWeek === 'Monday' || currentDayOfWeek === 'Tuesday' || currentDayOfWeek === 'Wednesday' || currentDayOfWeek === 'Thursday' || currentDayOfWeek === 'Friday') {
                return Promise.resolve(true);
              } else {
                return Promise.resolve(false);
              }
               });

               this.homey.flow.getConditionCard('dutch-flag-day')
               .registerRunListener(async (args, state) => {
                   const { isFlagDay } = args;
           
                   const today = new Date();
                   const currentMonth = today.getMonth();
                   const currentDay = today.getDate();
           
                   const flagDays = [
                       { name: "Verjaardag prinses Beatrix", month: 0, day: 31 },
                       { name: "Koningsdag", month: 3, day: 27 },
                       { name: "Dodenherdenking", month: 4, day: 4 },
                       { name: "Bevrijdingsdag", month: 4, day: 5 },
                       { name: "Verjaardag koningin Máxima", month: 4, day: 17 },
                       { name: "Veteranendag", month: 5, week: -1, day: 6 },
                       { name: "Formeel einde Tweede Wereldoorlog", month: 7, day: 15 },
                       { name: "Prinsjesdag", month: 8, week: 3, day: 2 },
                       { name: "Verjaardag prinses Catharina-Amalia", month: 11, day: 7 },
                       { name: "Koninkrijksdag", month: 11, day: 15 }
                   ];
           
                   for (const date of flagDays) {
                       if (date.month === currentMonth) {
                           if (date.day === currentDay || (date.week && date.week === getNthWeekdayOfMonth(today, date.day))) {
                               // Set the flagDay token
                               //this.homey.flow.getConditionCard('dutch-flag-day').setToken('flagDay', date.name);
           
                               return isFlagDay === 'is';
                           }
                       }
                   }
           
                   // If it's not a flag day, set the flagDay token to an empty string or another desired value
                   //this.homey.flow.getConditionCard('dutch-flag-day').setToken('flagDay', '');
           
                   return isFlagDay === "isn't";
               });
           
          
          function getNthWeekdayOfMonth(date, day) {
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const weekday = firstDay.getDay() - 1; // 0 = Monday, 1 = Tuesday, etc.
          
            const offset = (day - weekday + 7) % 7;
            const result = offset + 1;
          
            return result;
          }
          
            
           this.homey.flow.getConditionCard('dutch-public-holidays')
           .registerRunListener(async (args, state) => {
             // Haal de huidige datum op
             const today = new Date();
             const currentMonth = today.getMonth() + 1; // Maanden zijn nul-gebaseerd
             const currentDay = today.getDate();
         
             // Definieer de data van Nederlandse wettelijke feestdagen met bijbehorende namen
             const holidays = [
               { month: 1, day: 1, name: "Nieuwjaarsdag" },    // Nieuwjaarsdag
               { month: 4, day: 7, name: "Goede Vrijdag" },    // Goede Vrijdag
               { month: 4, day: 9, name: "Eerste Paasdag" },   // Eerste Paasdag
               { month: 4, day: 10, name: "Tweede Paasdag" },  // Tweede Paasdag
               { month: 4, day: 27, name: "Koningsdag" },     // Koningsdag
               { month: 5, day: 5, name: "Bevrijdingsdag" },  // Bevrijdingsdag
               { month: 5, day: 18, name: "Hemelvaartsdag" }, // Hemelvaartsdag
               { month: 5, day: 28, name: "Eerste Pinksterdag" },  // Eerste Pinksterdag
               { month: 5, day: 29, name: "Tweede Pinksterdag" }, // Tweede Pinksterdag
               { month: 12, day: 25, name: "Eerste Kerstdag" },   // Eerste Kerstdag
               { month: 12, day: 26, name: "Tweede Kerstdag" },   // Tweede Kerstdag
             ];
         
             // Controleer of de huidige datum overeenkomt met een Nederlandse wettelijke feestdag
             for (const holiday of holidays) {
               if (holiday.month === currentMonth && holiday.day === currentDay) {
                 // Voeg de naam van de feestdag toe aan het token
                 args.tokens.flagDay = holiday.name;
                 return true; // De huidige datum is een Nederlandse wettelijke feestdag
               }
             }
         
             return false; // De huidige datum is geen Nederlandse wettelijke feestdag
           });
         
           this.homey.flow.getConditionCard('is_race_day')
           .registerRunListener(async (args, state) => {
             // Haal de huidige datum op
             const today = new Date();
             const currentMonth = today.getMonth() + 1; // Maanden zijn zero-based, dus voegen we 1 toe
             const currentDay = today.getDate();
           
             // Racegegevens
             const races = [
               { name: 'Mexican GP (Mexico)', month: 10, day: 29 },
               { name: 'Brazil (Sao Paulo)', month: 11, day: 5 },
               { name: 'Las Vegas (Las Vegas)', month: 11, day: 18 },
               { name: 'Abu Dhabi GP (Yas Marina)', month: 11, day: 26 },
             ];
           
             // Zoek de race voor vandaag
             const raceForToday = races.find((race) => race.month === currentMonth && race.day === currentDay);
           
             // Controleer of er een race is voor vandaag
             if (raceForToday) {
               // Er is een race, stel de token in op de naam van de race
               return true;
             } else {
               // Geen race vandaag, stel de token in op "Today is not a race day"
               return false;
             }
           });
         
         
         
           this.homey.flow.getConditionCard('condition-leap-year')
            .registerRunListener(async (args, state) => {
            const { year } = args;
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

            return isLeapYear;
            });

    // -------------------- Action cards ----------------------  

        

        this.homey.flow.getActionCard('calculate-days-between-dates').registerRunListener((args, state) => {
            const { date1, date2 } = args;
            const date1Parts = date1.split('-');
            const date2Parts = date2.split('-');
            const date1Obj = new Date(
                parseInt(date1Parts[2], 10),
                parseInt(date1Parts[1], 10) - 1,
                parseInt(date1Parts[0], 10)
            );
            const date2Obj = new Date(
                parseInt(date2Parts[2], 10),
                parseInt(date2Parts[1], 10) - 1,
                parseInt(date2Parts[0], 10)
            );
    
            if (date1Obj < date2Obj) { 
                const timeDiff = date2Obj.getTime() - date1Obj.getTime(); 
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
                return {
                    result: daysDiff
                };
            } else {
                return {
                    result: 0 
                };
            }
        });

        this.homey.flow.getActionCard('create_countdown_timer')
        .registerRunListener(async (args, state) => {
            return new Promise((resolve, reject) => {
                const { event, number, dropdown } = args;
    
                // Logging the received arguments for clarity
                this.log(`Received arguments - Event: ${event}, Number: ${number}, Dropdown: ${dropdown}`);
    
                if (event && typeof number === 'number' && !isNaN(number) && number > 0 && dropdown) {
                    this.log(`Countdown Timer creation initiated for ${event} - ${number} ${dropdown}`);
    
                    let durationInMilliseconds;
                    switch (dropdown) {
                        case 'Seconds':
                            durationInMilliseconds = number * 1000;
                            this.log(`Setting timer duration to ${durationInMilliseconds} milliseconds.`);
                            break;
                        case 'Minutes':
                            durationInMilliseconds = number * 60 * 1000;
                            this.log(`Setting timer duration to ${durationInMilliseconds} milliseconds.`);
                            break;
                        case 'Hours':
                            durationInMilliseconds = number * 60 * 60 * 1000;
                            this.log(`Setting timer duration to ${durationInMilliseconds} milliseconds.`);
                            break;
                        default:
                            this.log(`Unknown unit: ${dropdown}`);
                            reject('Unknown unit selected.');
                            return;
                    }
    
                    setTimeout(() => {
                        this.log(`Timer ended for ${event}. Now triggering the card.`);
                        this.homey.flow.getTriggerCard('countdown_timer_ended')
                            .trigger({ event: event }, { event: event })  // Adding state here
                            .then(() => {
                                this.log('Successfully triggered the countdown_timer_ended card.');
                                resolve(true);
                            })
                            .catch(error => {
                                this.log('Error triggering the countdown_timer_ended card:', error);
                                reject(error);
                            });
                    }, durationInMilliseconds);
                } else {
                    this.log('Invalid input. Please provide event name, a positive number, and select a unit.');
                    reject('Invalid input.');
                }
            });
        });
    
        


        this.log('Better Days has been initialized');
    }
}

module.exports = BetterDays;
