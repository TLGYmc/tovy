// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchworkspace, getConfig, setConfig } from '@/utils/configEngine'
import prisma from '@/utils/database';
import { withSessionRoute } from '@/lib/withSession'
import { withPermissionCheck } from '@/utils/permissionsManager'
import { getUsername, getThumbnail, getDisplayName } from '@/utils/userinfoEngine'
import * as noblox from 'noblox.js'
type Data = {
	success: boolean
	error?: string
}

export default withPermissionCheck(handler, 'admin');

export async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
	const user = await prisma.user.findUnique({
		where: {
			userid: parseInt(req.query.userid as string)
		},
		include: {
			roles: {
				where: {
					workspaceGroupId: parseInt(req.query.id as string)
				}
			}
		}
	});
	if (!user?.roles.length) return res.status(404).json({ success: false, error: 'User not found' });
	const newrole = await prisma.role.findUnique({
		where: {
			id: req.body.role
		}
	});
	if (!newrole) return res.status(404).json({ success: false, error: 'Role not found' });
	if (user.roles.length === 0) return res.status(404).json({ success: false, error: 'User not found' });
	await prisma.user.update({
		where: {
			userid: parseInt(req.query.userid as string)
		},
		data: {
			roles: {
				disconnect: {
					id: user.roles[0].id
				},
				connect: {
					id: req.body.role
				}
			}
		}
	});


	res.status(200).json({ success: true })
}
