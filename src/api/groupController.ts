import { Request, Response } from 'express';

import { groupSchema } from './schema';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, NO_CONTENT_CODE, SUCCESS, FAIL } from '../constants';
import groupService from '../services/groupService';

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await groupService.getGroupById(req.params.id);

    if (!group) {
      return res.status(NOT_FOUND_CODE).json({ status: FAIL, message: 'Group not found' });
    }

    return res.json({
      status: SUCCESS,
      group,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.findAll();

    return res.json({
      status: SUCCESS,
      groups,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const groupExists = await groupService.findGroupByName(req.body.name);

    if (groupExists) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ status: FAIL, message: `Group with name ${req.body.name} already exists` });
    }

    const { error } = groupSchema.validate(req.body);

    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(BAD_REQUEST_CODE).json({ status: FAIL, message: errors });
    }

    const group = await groupService.createGroup(req.body);

    return res.json({
      status: SUCCESS,
      group,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const groupExists = await groupService.getGroupById(req.params.id);

    if (!groupExists) {
      return res.status(NOT_FOUND_CODE).json({ status: FAIL, message: 'Group not found' });
    }

    const { error } = groupSchema.validate(req.body);

    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(BAD_REQUEST_CODE).json({ status: FAIL, message: errors });
    }

    const group = await groupService.updateGroup(req.body, req.params.id);

    return res.json({
      status: SUCCESS,
      group,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    await groupService.deleteGroup(req.params.id);

    return res.status(NO_CONTENT_CODE).json({
      status: SUCCESS,
      group: null,
    });
  } catch (err) {
    return res.status(BAD_REQUEST_CODE).json({
      status: FAIL,
      message: err,
    });
  }
};
