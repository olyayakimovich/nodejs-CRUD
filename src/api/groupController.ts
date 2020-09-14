import { Request, Response } from 'express';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, NO_CONTENT_CODE } from '../constants';
import groupService from '../services/groupService';

export const getGroupById = async (req: Request, res: Response) => {
  const group = await groupService.getGroupById(req.params.id);

  if (!group) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'Group not found' });
  }

  return res.json({
    status: 'success',
    group,
  });
};

export const getAllGroups = async (req: Request, res: Response) => {
  const groups = await groupService.findAll();

  return res.json({
    status: 'success',
    groups,
  });
};

export const createGroup = async (req: Request, res: Response) => {
  const groupExists = await groupService.findGroupByName(req.body.name);

  if (groupExists) {
    return res
      .status(BAD_REQUEST_CODE)
      .json({ status: 'fail', message: `Group with name ${req.body.name} already exists` });
  }

  try {
    const group = await groupService.createGroup(req.body);

    return res.json({
      status: 'success',
      group,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const groupExists = await groupService.getGroupById(req.params.id);

  if (!groupExists) {
    return res.status(NOT_FOUND_CODE).json({ status: 'fail', message: 'Group not found' });
  }

  try {
    const group = await groupService.updateGroup(req.body, req.params.id);

    return res.json({
      status: 'success',
      group,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    await groupService.deleteGroup(req.params.id);

    return res.status(NO_CONTENT_CODE).json({
      status: 'success',
      group: null,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: 'fail',
      message: err,
    });
  }
};
