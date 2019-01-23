/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : cauth

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2019-01-14 00:46:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cappinfo
-- ----------------------------
DROP TABLE IF EXISTS `cAppinfo`;
CREATE TABLE `cAppinfo` (
  `appid` char(36) DEFAULT NULL,
  `secret` char(64) DEFAULT NULL,
  `ip` char(20) DEFAULT NULL,
  `login_duration` int(11) DEFAULT NULL,
  `qcloud_appid` char(64) DEFAULT NULL,
  `session_duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for csessioninfoS
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`) USING BTREE,
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='会话管理用户信息';

-- ----------------------------
-- Table structure for plan_detail_info
-- ----------------------------
DROP TABLE IF EXISTS `plan_detail_info`;
CREATE TABLE `plan_detail_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_detail_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_detail_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_start_time` timestamp NULL DEFAULT NULL,
  `plan_end_time` timestamp NULL DEFAULT NULL,
  `plan_actual_start_time` timestamp NULL DEFAULT NULL,
  `plan_actual_end_time` timestamp NULL DEFAULT NULL,
  `creator_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creator_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `priority` int(11) DEFAULT '0' COMMENT '优先级别【0:非优先;1:优先】',
  `status` int(11) DEFAULT '0' COMMENT '计划状态【0:创建1:执行中;2:完成;-1:删除】',
  `progress` int(11) DEFAULT '0' COMMENT '目标进度',
  `auth_type` int(11) DEFAULT '0' COMMENT '授权类型【0:公开;1:私密】',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0' COMMENT '删除状态【0:未删除;1:删除】',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for plan_info
-- ----------------------------
DROP TABLE IF EXISTS `plan_info`;
CREATE TABLE `plan_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '计划状态【0:创建1:执行中;2:完成】',
  `auth_type` int(11) DEFAULT '0' COMMENT '授权类型【0:公开;1:私密】',
  `remark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `creator_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creator_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0' COMMENT '删除状态【0:未删除;1:删除】',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for plan_user_ref_info
-- ----------------------------
DROP TABLE IF EXISTS `plan_user_ref_info`;
CREATE TABLE `plan_user_ref_info` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `friend_uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `friend_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_detail_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '授权【0:可见;1:不可见】',
  `creator_uid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户id',
  `open_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户昵称',
  `realName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `province` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像地址',
  `gender` int(11) DEFAULT NULL COMMENT '性别',
  `e_mail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电子邮箱',
  `mobile_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号码',
  `birthday` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '生日',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态【0：正常；1：停用】',
  `version` int(11) NOT NULL DEFAULT '1' COMMENT '版本号',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_unique` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户信息表';


/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : cauth

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2019-01-21 00:58:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for clock_record_info
-- ----------------------------
DROP TABLE IF EXISTS `clock_record_info`;
CREATE TABLE `clock_record_info` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clock_on_time` time DEFAULT NULL,
  `clock_off_time` time DEFAULT NULL,
  `clock_type` int(11) NOT NULL DEFAULT '0' COMMENT '0:正常上班打卡;1:加班打卡',
  `date_version` varchar(255)NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50722
Source Host           : localhost:3306
Source Database       : cauth

Target Server Type    : MYSQL
Target Server Version : 50722
File Encoding         : 65001

Date: 2019-01-21 00:58:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for clock_rule_info
-- ----------------------------
DROP TABLE IF EXISTS `clock_rule_info`;
CREATE TABLE `clock_rule_info` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clock_on_time` time DEFAULT NULL,
  `clock_off_time` time DEFAULT NULL,
  `clock_type` int(11) DEFAULT '0',
  `clock_on_min_time` time DEFAULT NULL,
  `clock_on_max_time` time DEFAULT NULL,
  `clock_off_min_time` time DEFAULT NULL,
  `clock_off_max_time` time DEFAULT NULL,
  `clock_valid_week` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0:有效；1：无效',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80011
Source Host           : 127.0.0.1:3306
Source Database       : cauth

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2019-01-23 18:43:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for note_info
-- ----------------------------
DROP TABLE IF EXISTS `note_info`;
CREATE TABLE `note_info` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `note_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note_content` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0：不用提醒；1：需要提醒',
  `remind_time` timestamp NULL DEFAULT NULL COMMENT '提醒时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
