// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ScheduleModule = buildModule("SchedulesModule", (m) => {

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

  

  return { schedules };

});

export default ScheduleModule;
