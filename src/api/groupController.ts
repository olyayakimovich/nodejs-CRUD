import { NextFunction, Request, Response } from 'express';

import { groupSchema } from './schema';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, NO_CONTENT_CODE, SUCCESS } from '../constants';
import groupService from '../services/groupService';
import catchAsync from '../utils/catchAsync';
import HttpException from '../utils/httpExeption';

export const getGroupById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { method, params, url } = req;
  const group = await groupService.getGroupById(params.id);

  if (!group) {
    return next(new HttpException(NOT_FOUND_CODE, 'Group not found', `getGroupById: ${method} request to ${url}`));
  }

  return res.json({
    status: SUCCESS,
    group,
  });
});

export const getAllGroups = catchAsync(async (req: Request, res: Response) => {
  const groups = await groupService.findAll();

  return res.json({
    status: SUCCESS,
    groups,
  });
});

export const createGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { body, method, url } = req;
  const groupExists = await groupService.findGroupByName(body.name);

  if (groupExists) {
    return next(
      new HttpException(
        BAD_REQUEST_CODE,
        `Group with name ${body.name} already exists`,
        `createGroup: ${method} request to ${url}`,
        body
      )
    );
  }

  const { error } = groupSchema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, `createGroup: ${method} request to ${url}`, body));
  }

  const group = await groupService.createGroup(body);

  return res.json({
    status: SUCCESS,
    group,
  });
});

export const updateGroup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { body, method, url, params } = req;
  const groupExists = await groupService.getGroupById(params.id);

  if (!groupExists) {
    return next(new HttpException(NOT_FOUND_CODE, 'Group not found', `updateGroup: ${method} request to ${url}`, body));
  }

  const { error } = groupSchema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);

    return next(new HttpException(BAD_REQUEST_CODE, `${errors}`, `updateGroup: ${method} request to ${url}`, body));
  }

  const group = await groupService.updateGroup(body, params.id);

  return res.json({
    status: SUCCESS,
    group,
  });
});

export const deleteGroup = catchAsync(async (req: Request, res: Response) => {
  await groupService.deleteGroup(req.params.id);

  return res.status(NO_CONTENT_CODE).json({
    status: SUCCESS,
    group: null,
  });
});
