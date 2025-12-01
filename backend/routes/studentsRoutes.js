import express from 'express';
import { 
  getAllStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent,
  syncStudents // 👈 1. Import this
} from '../controllers/studentsController.js';

const router = express.Router();

router.get('/sync', syncStudents); // 👈 2. Add this route (MUST BE BEFORE /:id)

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;