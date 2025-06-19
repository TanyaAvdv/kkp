import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

router.get('/', ContactController.getAllContacts);
// @ts-ignore
router.get('/:id', ContactController.getContactById);
// @ts-ignore
router.post('/', ContactController.createContact);
// @ts-ignore
router.put('/:id', ContactController.updateContact);
// @ts-ignore
router.delete('/:id', ContactController.deleteContact);

export default router;
