import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
} from '../schemas/task.schema';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.getAll);
router.get('/status/:status', taskController.getByStatus);
router.get('/priority/:priority', taskController.getByPriority);
router.get('/:id', validate(getTaskSchema), taskController.getById);
router.post('/', validate(createTaskSchema), taskController.create);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(deleteTaskSchema), taskController.delete);

export default router;