// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { viem } from "hardhat";



const ScheduleModule = buildModule("SchedulesModule",  (m) => {
  
  
  viem


  const schedules = m.contract('CourseContract');
  m.call(schedules, 'createCourse', ['Calculo Diferrencial', 'Curso de calculo diferencial', 3], {
    id: 'course1',
  });
  m.call(schedules, 'createCourse', ['Algebra Lineal', 'Curso de algebra lineal', 4], { id: 'course2' });
  m.call(schedules, 'createCourse', ['Fisica I', 'Curso de fisica I', 3], { id: 'course3' });
  m.call(schedules, 'createCourse', ['Quimica General', 'Curso de quimica general', 3], { id: 'course4' });
  m.call(schedules, 'createCourse', ['Programacion I', 'Curso de programacion I', 4], { id: 'course5' });
  m.call(schedules, 'createCourse', ['Ecuaciones Diferenciales', 'Curso de ecuaciones diferenciales', 3], { id: 'course6' });
  m.call(schedules, 'createCourse', ['Estadistica', 'Curso de estadistica', 3], { id: 'course7' });
  m.call(schedules, 'createCourse', ['Calculo Integral', 'Curso de calculo integral', 3], { id: 'course8' });
  m.call(schedules, 'createCourse', ['Matematicas Discretas', 'Curso de matematicas discretas', 3], { id: 'course9' });
  m.call(schedules, 'createCourse', ['Bases de Datos', 'Curso de bases de datos', 4], { id: 'course10' });
  m.call(schedules, 'createCourse', ['Sistemas Operativos', 'Curso de sistemas operativos', 4], { id: 'course11' });
  m.call(schedules, 'createCourse', ['Redes de Computadoras', 'Curso de redes de computadoras', 4], { id: 'course12' });
  m.call(schedules, 'createCourse', ['Inteligencia Artificial', 'Curso de inteligencia artificial', 4], { id: 'course13' });
  m.call(schedules, 'createCourse', ['Ingenieria de Software', 'Curso de ingenieria de software', 4], { id: 'course14' });
  m.call(schedules, 'createCourse', ['Analisis Numerico', 'Curso de analisis numerico', 3], { id: 'course15' });
  m.call(schedules, 'createCourse', ['Teoria de la Computacion', 'Curso de teoria de la computacion', 3], { id: 'course16' });
  m.call(schedules, 'createCourse', ['Compiladores', 'Curso de compiladores', 4], { id: 'course17' });
  m.call(schedules, 'createCourse', ['Arquitectura de Computadoras', 'Curso de arquitectura de computadoras', 4], { id: 'course18' });
  m.call(schedules, 'createCourse', ['Seguridad Informatica', 'Curso de seguridad informatica', 4], { id: 'course19' });
  m.call(schedules, 'createCourse', ['Desarrollo Web', 'Curso de desarrollo web', 4], { id: 'course20' });
  m.call(schedules, 'createCourse', ['Machine Learning', 'Curso de machine learning', 4], { id: 'course21' });

  m.call(schedules, 'createClassroom', ['Salon 101', 'Bloque 1', 20], {id: 'classroom1'});
  m.call(schedules, 'createClassroom', ['Salon 102', 'Bloque 2', 20], {id: 'classroom2'});
  m.call(schedules, 'createClassroom', ['Salon 103', 'Bloque 3', 20], {id: 'classroom3'});
  m.call(schedules, 'createClassroom', ['Salon 104', 'Bloque 4', 20], {id: 'classroom4'});
  m.call(schedules, 'createClassroom', ['Salon 105', 'Bloque 5', 20], {id: 'classroom5'});

  //profesores
  m.call(schedules, 'registerUser', ['0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 1], {id: 'proffesor1'});
  m.call(schedules, 'registerUser', ['0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 1], {id: 'proffesor2'});
  m.call(schedules, 'registerUser', ['0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 1], {id: 'proffesor3'});
  m.call(schedules, 'registerUser', ['0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 1], {id: 'proffesor4'});
  m.call(schedules, 'registerUser', ['0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 1], {id: 'proffesor5'});
  //estudiantes
  m.call(schedules, 'registerUser', ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 0], {id: 'student1'});
  m.call(schedules, 'registerUser', ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 0], {id: 'student2'});
  m.call(schedules, 'registerUser', ['0x90F79bf6EB2c4f870365E785982E1f101E93b906', 0], {id: 'student3'});
  m.call(schedules, 'registerUser', ['0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 0], {id: 'student4'});
  m.call(schedules, 'registerUser', ['0x976EA74026E726554dB657fA54763abd0C3a0aa9', 0], {id: 'student5'});
  m.call(schedules, 'registerUser', ['0x14dC79964da2C08b23698B3D3cc7Ca32193d9955', 0], {id: 'student6'});
  m.call(schedules, 'registerUser', ['0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 0], {id: 'student7'});
  m.call(schedules, 'registerUser', ['0xa0Ee7A142d267C1f36714E4a8F75612F20a79720', 0], {id: 'student8'});
  m.call(schedules, 'registerUser', ['0xBcd4042DE499D14e55001CcbB24a551F3b954096', 0], {id: 'student9'});



  

  m.call(schedules, 'addSchedule', [0, 1, 8, 10,0,'0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'], { id: 'schedule1' });
  m.call(schedules, 'addSchedule', [0, 1, 10, 12,0, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0'], { id: 'schedule2' });
  m.call(schedules, 'addSchedule', [0, 1, 12, 14,0, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'], { id: 'schedule3' });
  m.call(schedules, 'addSchedule', [1,1,6,8,0, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30'], { id: 'schedule4' });
  m.call(schedules, 'addSchedule', [1,1,8,10,0, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71'], { id: 'schedule5' });
  m.call(schedules, 'addSchedule', [1,1,10,12,0, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'], { id: 'schedule6' });
  m.call(schedules, 'addSchedule', [1,1,12,14,0, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'], { id: 'schedule7' });
  m.call(schedules, 'addSchedule', [2,1,8,10,0,'0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'], { id: 'schedule8' });
  m.call(schedules, 'addSchedule', [2,1,10,12,0, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'], { id: 'schedule9' });



  

  return { schedules };

});

export default ScheduleModule;
